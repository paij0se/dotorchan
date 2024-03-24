defmodule Dotorchan.Application do
  use Application
  require Logger

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: Dotorchan.Router, options: [port: 4000]}
    ]
    opts = [strategy: :one_for_one, name: Dotorchan.Supervisor]

    Logger.info("http://localhost:4000/")

    Supervisor.start_link(children, opts)
  end
end
