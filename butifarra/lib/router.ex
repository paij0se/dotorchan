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

  #####################################################
  post "/api/v1/g" do
    Routes.Boards.post(conn, "g")
  end

  get "/api/v1/g" do
    Routes.Boards.get_publications(conn, "g")
  end

  #####################################################
  post "/api/v1/pol" do
    Routes.Boards.post(conn, "pol")
  end

  get "/api/v1/pol" do
    Routes.Boards.get_publications(conn, "pol")
  end

  #########################################################
  post "/api/v1/qst" do
    Routes.Boards.post(conn, "qst")
  end

  get "/api/v1/qst" do
    Routes.Boards.get_publications(conn, "qst")
  end

  #############################################################
  # TODO: Implementar
  get "/api/v1/stats" do
    Routes.Stats.get_stats(conn)
  end

  delete "/admin/delete" do
    Routes.Admin.delete(conn)
  end

  match _ do
    send_resp(conn, 404, "Oops!")
  end
end
