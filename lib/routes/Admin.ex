defmodule Routes.Admin do
  import Plug.Conn

  def admin_auth(conn) do
    admin_ip = System.get_env("ADMIN_IP") || "192.168.1.6"
    ip = Tools.Ip.get(conn)
    IO.inspect(admin_ip, label: "admin_ip")
    IO.inspect(ip, label: "ip")
    IO.inspect("#{ip == admin_ip}")
    if ip == admin_ip do
      send_file(conn, 200, "admin/index.html")
    else
      send_resp(conn, 403, "Forbidden")
    end
  end
end
