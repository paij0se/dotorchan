defmodule Routes.Admin do
  import Plug.Conn

  def admin_auth(conn) do
    admin_ip = System.get_env("ADMIN_IP") || "192.168.1.6"
    ip = Tools.Ip.get(conn)
    IO.inspect(admin_ip, label: "admin_ip")
    IO.inspect(ip, label: "ip")
    IO.inspect("#{ip == admin_ip}")

    if ip == admin_ip do
      send_file(conn, 200, "admin/index.html")
    else
      send_resp(conn, 403, "Forbidden")
    end
  end

  def delete(conn) do
    admin_ip = System.get_env("ADMIN_IP") || "192.168.1.6"
    ip = Tools.Ip.get(conn)
    IO.inspect(admin_ip, label: "admin_ip")
    IO.inspect(ip, label: "ip")
    IO.inspect("#{ip == admin_ip}")

    case ip == admin_ip do
      true ->
        id =
          case conn.body_params do
            %{"id" => a_id} ->
              a_id

            _ ->
              ""
          end

        board =
          case conn.body_params do
            %{"board" => a_board} ->
              a_board

            _ ->
              ""
          end

        board |> IO.inspect(label: "board")
        id |> IO.inspect(label: "id")
        c = Db.Connect.connect()
        # {:ok, %Mongo.DeleteResult{acknowledged: true, deleted_count: 1}}
        # get the deleted_count
        {:ok, %Mongo.DeleteResult{deleted_count: deleted_count}} =
          Mongo.delete_one(c, board, %{"user_id" => id})

        if deleted_count == 0 do
          response = %{
            "status" => "error",
            "message" => "Message not found"
          }

          send_resp(
            conn |> put_resp_content_type("application/json"),
            404,
            Jason.encode!(response)
          )
        else
          response = %{
            "status" => "ok",
            "id" => id,
            "board" => board
          }

          send_resp(
            conn |> put_resp_content_type("application/json"),
            400,
            Jason.encode!(response)
          )
        end

      false ->
        send_resp(
          conn |> put_resp_content_type("application/json"),
          403,
          Jason.encode!(%{"status" => "Forbidden"})
        )
    end
  end
end
