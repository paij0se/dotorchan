defmodule Routes.Boards.G do
  import Plug.Conn

  def post(conn, board) do
    content =
      case conn.body_params do
        %{"content" => a_content} -> a_content
        _ -> ""
      end

    id = :rand.uniform(100_000_000)
    anon_id = Tools.Ip.get(conn) |> Tools.Encrypt.e()
    Map.get(conn.body_params, "content") |> IO.inspect(label: "content")

    response = %{
      "id" => id,
      "content" => content,
      "anon_id" => anon_id,
      "created_at" => DateTime.utc_now() |> DateTime.to_iso8601()
    }

    c = Db.Connect.connect()
    Mongo.insert_one(c, board, response) |> IO.inspect(label: "insert")
    send_resp(conn |> put_resp_content_type("application/json"), 200, Jason.encode!(response))

    # curl -X POST -H "Content-Type: application/json" -d '{"content": "dotorchan"}' http://localhost:8080/api/v1/g
  end

  def get_publications(conn, board) do
    c = Db.Connect.connect()

    # show latest to oldest
    response =
      Mongo.aggregate(c, board, [
        %{
          "$sort" => %{
            "created_at" => -1
          }
        },
        %{
          "$project" => %{
            "_id" => 0
          }
        }
      ])
      |> Enum.to_list()
      |> Jason.encode!()

    send_resp(conn |> put_resp_content_type("application/json"), 200, response)
  end
end
