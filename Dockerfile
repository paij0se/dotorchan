FROM bitwalker/alpine-elixir:1.15
WORKDIR /app
COPY mix* ./
RUN mix deps.get
RUN mix deps.compile
WORKDIR /app
COPY . .
RUN mix compile
CMD [ "mix", "run", "--no-halt" ]