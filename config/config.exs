import Config

config :dotorchan, cowboy_port: (System.get_env("PORT") || "8080") |> String.to_integer()
