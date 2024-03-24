defmodule Dotorchan.Router do
  use Plug.Router

  plug(:match)
  plug(:dispatch)

  get "/admin" do
    Routes.Admin.admin_auth(conn)
  end

  match _ do
    send_resp(conn, 404, "Oops!")
  end
end
