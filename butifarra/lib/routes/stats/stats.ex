defmodule Routes.Stats do
  import Plug.Conn

  def get_stats(conn) do
    # TODO: Implement stats
    boards = ["g", "pol", "qst"]
    c = Db.Connect.connect()

    counter =
      Enum.reduce(boards, 0, fn board, acc ->
        posts =
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

        acc + length(posts)
      end)

    send_resp(conn |> put_resp_content_type("application/json"), 200, Jason.encode!(counter))
  end
end
