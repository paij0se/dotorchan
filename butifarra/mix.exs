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
      extra_applications: [:logger, :mongodb],
      mod: {Dotorchan.Application, []}
    ]
  end

  # Run "mix help deps" to learn about dependencies.
  defp deps do
    [
      {:mongodb, "~> 1.0.0"},
      {:plug_cowboy, "~> 2.0"},
      {:jason, "~> 1.2.0"},
      {:cors_plug, "~> 3.0"},
      {:httpoison, "~> 2.0"},
    ]
  end
end
