defmodule Db.Connect do
  def connect do
    # localhost -> local
    # mongodb -> docker-compose.yml
    {:ok, c} = Mongo.start_link(url: System.get_env("MONGO_URL"))
    c
  end
end
