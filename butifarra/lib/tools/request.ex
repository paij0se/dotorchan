defmodule MyHttpClient do
  use HTTPoison.Base

  # Set the default options for all requests

  # Define the base URL for your requests
  @base_url "http://example.com"

  # Implement the callbacks
  def process_request_url(url) do
    URI.merge(@base_url, url) |> to_string
  end

  def process_response_body(body, _headers) do
    {:ok, body}
  end
end

# Now you can use the HTTPoison functions to make requests

# Example POST request with a JSON payload
defmodule Tools.Post do
  require HTTPoison

  def make_post_request(url, payload) do
    headers = [
      {"Content-Type", "application/json"}
    ]

    HTTPoison.post(url, payload |> Jason.encode!(), headers)
  end
end

defmodule Tools.Get do
  require HTTPoison

  def make_get_request(url) do
    HTTPoison.get(url)
  end
end
