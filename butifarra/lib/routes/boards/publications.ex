defmodule Routes.Boards do
  import Plug.Conn

  def post(conn, board) do
    content =
      case conn.body_params do
        %{"content" => a_content} ->
          a_content

        _ ->
          ""
      end

    file =
      case conn.body_params do
        %{"file" => a_file} ->
          a_file

        _ ->
          ""
      end

    title =
      case conn.body_params do
        %{"title" => a_title} ->
          a_title

        _ ->
          ""
      end

    case content do
      "" ->
        send_resp(
          conn |> put_resp_content_type("application/json"),
          400,
          Jason.encode!(%{"error" => "content is required"})
        )

      _ ->
        # check if the ip already resolved the captcha
        c = Db.Connect.connect()
        ip = Tools.Ip.get(conn)
        IO.inspect(ip, label: "ip")

        captcha =
          Mongo.find_one(c, "ips-to-verify", %{"ip" => ip}) |> IO.inspect(label: "captcha")

        # captcha: %{
        # "_id" => #BSON.ObjectId<6612b9150f14923e6478d5f4>,
        # "ip" => "192.168.1.6",
        # "text" => "aNDd7U",
        # "verified" => false
        # }
        # if verified is false, return 403
        # if verified is true, continue
        if captcha["verified"] == false or captcha["verified"] == nil do
          send_resp(
            conn |> put_resp_content_type("application/json"),
            403,
            Jason.encode!(%{"error" => "captcha required"})
          )
        else
          # unique id, life 4chan XD
          # $now.=" ID:".substr(crypt(md5($_SERVER["REMOTE_ADDR"].'id'.date("Ymd", $time)),'id'),+3);
          # user_id (ip) + (datetime) + (random number) + (random number)
          post_id =
            String.slice(Tools.Encrypt.e(Integer.to_string(System.monotonic_time())), 0, 4) <>
              String.slice(
                Integer.to_string(Enum.random(1..100_000_000_000)),
                0,
                4
              ) <>
              String.slice(
                Integer.to_string(Enum.random(1..100_000_000_000)),
                0,
                4
              )

          user_id = String.slice(Tools.Encrypt.e(Tools.Ip.get(conn)), 0, 12)
          IO.inspect(file, label: "file")

          response = %{
            "user_id" => user_id,
            "post_id" => post_id,
            "title" => title,
            "content" => content,
            "created_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
            "file" => file
          }

          for_the_database = %{
            "user_id" => user_id,
            "post_id" => post_id,
            "title" => title,
            "content" => content,
            "ip" => ip,
            "created_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
            "file" => file
          }

          Mongo.insert_one(c, board, for_the_database) |> IO.inspect(label: "insert")

          send_resp(
            conn |> put_resp_content_type("application/json"),
            200,
            Jason.encode!(response)
          )

          # delete the captcha
          Mongo.delete_one(c, "ips-to-verify", %{"ip" => ip})
        end
    end
  end

  def get_publications(conn, board) do
    c = Db.Connect.connect()

    response =
      Mongo.aggregate(c, board, [
        %{
          "$sort" => %{
            "created_at" => -1
          }
        },
        %{
          "$project" => %{
            "_id" => 0,
            "ip" => 0
          }
        }
      ])
      |> Enum.to_list()
      |> Jason.encode!()

    send_resp(conn |> put_resp_content_type("application/json"), 200, response)
  end

  def get_publication(conn, board) do
    c = Db.Connect.connect()
    post_id = conn.params["id"]

    response =
      Mongo.aggregate(c, board, [
        %{
          "$match" => %{
            "post_id" => post_id
          }
        },
        %{
          "$project" => %{
            "_id" => 0,
            "ip" => 0,
            "comments.ip" => 0
          }
        }
      ])
      |> Enum.to_list()
      |> Jason.encode!()

    case response do
      "[]" ->
        send_resp(
          conn |> put_resp_content_type("application/json"),
          404,
          Jason.encode!(%{"error" => "post not found"})
        )

      _ ->
        send_resp(conn |> put_resp_content_type("application/json"), 200, response)
    end
  end

  def post_comment_thread(conn, board) do
    c = Db.Connect.connect()
    post_id = conn.params["id"]

    content =
      case conn.body_params do
        %{"content" => a_content} ->
          a_content

        _ ->
          ""
      end

    file =
      case conn.body_params do
        %{"file" => a_file} ->
          a_file

        _ ->
          ""
      end

    case content do
      "" ->
        send_resp(
          conn |> put_resp_content_type("application/json"),
          400,
          Jason.encode!(%{"error" => "content is required"})
        )

      _ ->
        # unique id, life 4chan XD
        # $now.=" ID:".substr(crypt(md5($_SERVER["REMOTE_ADDR"].'id'.date("Ymd", $time)),'id'),+3);
        # user_id (ip) + (datetime) + (random number) + (random number)
        comment_id =
          String.slice(Tools.Encrypt.e(Integer.to_string(System.monotonic_time())), 0, 4) <>
            String.slice(
              Integer.to_string(Enum.random(1..100_000_000_000)),
              0,
              4
            ) <>
            String.slice(
              Integer.to_string(Enum.random(1..100_000_000_000)),
              0,
              4
            )

        user_id = String.slice(Tools.Encrypt.e(Tools.Ip.get(conn)), 0, 12)

        response = %{
          "user_id" => user_id,
          "comment_id" => comment_id,
          "content" => content,
          "created_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
          "file" => file
        }

        for_the_database = %{
          "user_id" => user_id,
          "comment_id" => comment_id,
          "content" => content,
          "ip" => Tools.Ip.get(conn),
          "created_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
          "file" => file
        }

        {:ok, %Mongo.UpdateResult{matched_count: matched_count}} =
          Mongo.update_one(
            c,
            board,
            %{
              "post_id" => post_id
            },
            %{
              "$push" => %{
                "comments" => for_the_database
              }
            }
          )
          |> IO.inspect(label: "insert")

        if matched_count == 0 do
          send_resp(
            conn |> put_resp_content_type("application/json"),
            404,
            Jason.encode!(%{"error" => "post not found"})
          )
        else
          send_resp(
            conn |> put_resp_content_type("application/json"),
            200,
            Jason.encode!(response)
          )
        end
    end
  end
end
