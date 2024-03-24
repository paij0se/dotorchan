defmodule Dotorchan.Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/" do
    ip = Tools.Ip.get_remote_ip(conn)
    ip |> IO.inspect(label: "Remote IP")
    send_resp(conn, 200, "Welcome!")
  end

  match _ do
    send_resp(conn, 404, "Oops!")
  end
end
