require 'rubygems'
require 'bundler'

Bundler.require

configure do
  use Rack::Session::Cookie, :secret => 'Pidgeons and marange!!rewfasoiduj;vln8888888'
end

puts "STARTING!!!"

require "./routes.rb"

run Sinatra::Application