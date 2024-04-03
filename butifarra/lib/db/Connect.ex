defmodule Db.Connect do
  def connect do
    # localhost -> local
    # mongodb -> docker-compose.yml
    {:ok, c} = Mongo.start_link(url: "mongodb://localhost:27017/dotorchan")
    c
  end
end