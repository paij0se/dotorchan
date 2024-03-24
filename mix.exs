defmodule Dotorchan.MixProject do
  use Mix.Project

  def project do
    [
      app: :dotorchan,
      version: "0.1.0",
      elixir: "~> 1.15",
      start_permanent: Mix.env() == :prod,
      deps: deps()
    ]
  end

  # Run "mix help compile.app" to learn about applications.
  def application do
    [
      extra_applications: [:logger, :mongodb, :poolboy],
      mod: {Dotorchan.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:mongodb, "~> 0.5.1"},
      {:poolboy, "~> 1.5.2"},
      {:plug_cowboy, "~> 2.0"},
      {:jason, "~> 1.2.0"},
      {:remote_ip, "~> 1.1"}
    ]
  end
end
