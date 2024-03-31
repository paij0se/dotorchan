defmodule Routes.Admin do
  import Plug.Conn

  def admin_auth(conn) do
    admin_ip = System.get_env("ADMIN_IP") || {127, 0, 0, 1}
    ip = Tools.Ip.get(conn)
    IO.inspect("#{ip == admin_ip}")

    if ip == admin_ip do
      send_file(conn, 200, "admin/index.html")
    else
      IO.inspect(admin_ip)
      send_resp(conn, 403, "Forbidden")
    end
  end
end
