defmodule Routes.Boards.G do
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
        user_id =
          String.slice(Tools.Encrypt.e(Tools.Ip.get(conn)), 0, 4) <>
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

        IO.inspect(file, label: "file")

        response = %{
          "user_id" => user_id,
          "content" => content,
          "ip" => Tools.Ip.get(conn),
          "created_at" => DateTime.utc_now() |> DateTime.to_iso8601(),
          "file" => file
        }

        c = Db.Connect.connect()
        Mongo.insert_one(c, board, response) |> IO.inspect(label: "insert")

        send_resp(
          conn |> put_resp_content_type("application/json"),
          200,
          Jason.encode!(response)
        )
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
end
