import Config

config :dotorchan, cowboy_port: (System.get_env("PORT") || "8080") |> String.to_integer()

config :ex_aws,
  access_key_id: [{:system, "AWS_ACCESS_KEY_ID"}, :instance_role],
  secret_access_key: [{:system, "AWS_SECRET_ACCESS_KEY"}, :instance_role]
