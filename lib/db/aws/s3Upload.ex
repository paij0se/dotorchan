defmodule S3Uploader do
  import ExAws.S3

  @bucket "dotorchan"

  def upload_file(file_path, key) do
    {:ok, file_content} = File.read(file_path)

    case put_object(@bucket, key, file_content) do
      {:ok, _etag} ->
        IO.puts("File uploaded successfully!")

      {:error, reason} ->
        IO.puts("Error uploading file: #{reason}")
    end
  end
end
