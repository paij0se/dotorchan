defmodule Dotorchan.Application do
  use Application
  require Logger

  def start(_type, _args) do
    children = [
      {Plug.Cowboy, scheme: :http, plug: Dotorchan.Router, options: [port: cowboy_port()]}
    ]

    opts = [strategy: :one_for_one, name: Dotorchan.Supervisor]

    Logger.info("http://localhost:#{cowboy_port()}")

    Supervisor.start_link(children, opts)
  end

  defp cowboy_port, do: Application.get_env(:dotorchan, :cowboy_port, 8080)
end
