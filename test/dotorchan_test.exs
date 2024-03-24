defmodule DotorchanTest do
  use ExUnit.Case
  doctest Dotorchan

  test "greets the world" do
    assert Dotorchan.hello() == :world
  end
end
