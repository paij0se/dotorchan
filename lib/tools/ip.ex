defmodule Tools.Ip do
  import Plug.Conn

  def get_remote_ip(conn) do
    forwarded_for_header = get_req_header(conn, "x-forwarded-for")

    case forwarded_for_header do
      [ip | _] -> ip
      _ -> conn.remote_ip
    end
  end
end
