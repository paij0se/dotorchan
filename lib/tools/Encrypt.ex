defmodule Tools.Encrypt do
  def e(data) do
    :crypto.hash(:sha256, data) |> Base.encode16() |> String.downcase()
  end
end
