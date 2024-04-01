defmodule Routes.Stats do
  import Plug.Conn

  def get_stats(conn) do
    # TODO: Implement stats
    send_resp(conn, 200, "Stats")
  end
end
