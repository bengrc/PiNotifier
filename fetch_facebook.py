import urllib2
import json
import time

def get_page_data(page_id,access_token):
    api_endpoint = "https://graph.facebook.com/v2.4/"
    fb_graph_url = api_endpoint+page_id+"?fields=id,name,likes,unread_notif_count,link&access_token="+access_token
    try:
        api_request = urllib2.Request(fb_graph_url)
        api_response = urllib2.urlopen(api_request)
        
        try:
            return json.loads(api_response.read())
        except (ValueError, KeyError, TypeError):
            return "JSON error"

    except IOError , e:
        if hasattr(e, 'code'):
            return e.code
        elif hasattr(e, 'reason'):
            return e.reason
                                    
while 1:
    page_id = "1664109577184012" # username or id 
    token = "CAACEdEose0cBAKBSd9olmJZA3rMZCUy4XZB8qDXwiM49G4OgfYbJQHYNWmyzcFnuTeunGyQZBZChcaEoC8uEjTZCNyWpPtvIWEOkEY7H5AZBFEmZBAFeXEYjzCCOob1ZAK6qwIMskMBQdLjcWBJpM5ZCIeUytLAWTgJwkeXZCwZChzeX5hZCk3kEZC86w25KfmItZBHepMJIZA67VYBYCgZDZD"  # Access Token
    page_data = get_page_data(page_id,token)

    print "Page Name:"+ page_data['name']
    print "Likes:"+ str(page_data['likes'])
    print "Unread notifications:"+ str(page_data['unread_notif_count'])
    
    time.sleep(0.5)