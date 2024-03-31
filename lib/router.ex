defmodule Dotorchan.Router do
  use Plug.Router

  plug(:match)

  plug(Plug.Parsers,
    parsers: [:json],
    pass: ["application/json"],
    json_decoder: Jason
  )

  plug(CORSPlug)

  plug(:dispatch)

  get "/admin" do
    Routes.Admin.admin_auth(conn)
  end

  post "/api/v1/g" do
    Routes.Boards.G.post(conn, "g")
  end

  get "/api/v1/g" do
    Routes.Boards.G.get_publications(conn, "g")
  end

  match _ do
    send_resp(conn, 404, "Oops!")
  end
end
