require 'sinatra'
require './api_manager.rb'

get '/' do
  erb :index
end