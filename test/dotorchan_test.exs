defmodule DotorchanTest do
  use ExUnit.Case
  doctest Dotorchan

  test "greets the world" do
    assert Dotorchan.hello() == :world
  end

  test "uploads a file to S3" do
    # Arrange
    file_path = "peo.png"
    key = "peo.png"

    # Act
    S3Uploader.upload_file(file_path, key)

    # Assert
    assert true
  end
end
