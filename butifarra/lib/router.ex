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

  post "/api/v1/g/:id" do
    Routes.Boards.post_comment_thread(conn, "g")
  end

  get "/api/v1/g" do
    Routes.Boards.get_publications(conn, "g")
  end

  get "/api/v1/g/:id" do
    Routes.Boards.get_publication(conn, "g")
  end

  #####################################################
  post "/api/v1/pol" do
    Routes.Boards.post(conn, "pol")
  end

  post "/api/v1/pol/:id" do
    Routes.Boards.post_comment_thread(conn, "pol")
  end

  get "/api/v1/pol" do
    Routes.Boards.get_publications(conn, "pol")
  end

  get "/api/v1/pol/:id" do
    Routes.Boards.get_publication(conn, "pol")
  end

  #########################################################
  post "/api/v1/mu" do
    Routes.Boards.post(conn, "mu")
  end

  post "/api/v1/mu/:id" do
    Routes.Boards.post_comment_thread(conn, "mu")
  end

  get "/api/v1/mu" do
    Routes.Boards.get_publications(conn, "mu")
  end

  get "/api/v1/mu/:id" do
    Routes.Boards.get_publication(conn, "mu")
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
