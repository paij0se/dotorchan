defmodule Dotorchan.Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/admin" do
    admin_ip = System.get_env("ADMIN_IP")
    ip = Tools.Ip.get_remote_ip(conn)
    IO.inspect("#{ip == admin_ip}")
    if ip == admin_ip do
      send_resp(conn, 200, "Welcome!")
    else
      IO.inspect(admin_ip)
      send_resp(conn, 403, "Forbidden")
    end
  end

  match _ do
    send_resp(conn, 404, "Oops!")
  end
end
