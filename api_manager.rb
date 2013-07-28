require 'jsonapi'
require './config.rb'

class ApiManager

  def initialize
    @api = JSONAPI::JSONAPI.new($apiSettings)
  end

  def call(method, *args)
    @api.call_api(method, *args).body
  end
end