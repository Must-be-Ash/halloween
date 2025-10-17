// typescript/site/app/ecosystem/partners-data/firecrawl/metadata.json

{
    "name": "Firecrawl",
    "description": "Firecrawl is a web scraping API that allows you to turn websites into LLM-ready data.",
    "logoUrl": "/logos/firecrawl.png",
    "websiteUrl": "https://firecrawl.dev",
    "category": "Services/Endpoints"
  }

# search example:

## input:

### js:

```
const url = 'https://api.firecrawl.dev/v2/search';
const options = {
  method: 'POST',
  headers: {
    Authorization: 'Bearer fc-7c8709526a864393958c93e4a4562344',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    "query": "what's the news today 2025-08-27 in Vancouver Canada",
    "sources": [
        "web"
    ],
    "categories": [],
    "limit": 10,
    "scrapeOptions": {
        "onlyMainContent": true,
        "maxAge": 172800000,
        "parsers": [
            "pdf"
        ],
        "formats": [
            "summary"
        ]
      }
})
};

try {
  const response = await fetch(url, options);
  const data = await response.json();
  console.log(data);
} catch (error) {
  console.error(error);
}

```

### cURL:

```
curl --request POST \
  --url https://api.firecrawl.dev/v2/search \
  --header 'Authorization: Bearer fc-7c8709526a864393958c93e4a4562344' \
  --header 'Content-Type: application/json' \
  --data '{
    "query": "what's the news today 2025-08-27 in Vancouver Canada",
    "sources": [
        "web"
    ],
    "categories": [],
    "limit": 10,
    "scrapeOptions": {
        "onlyMainContent": true,
        "maxAge": 172800000,
        "parsers": [
            "pdf"
        ],
        "formats": [
            "summary"
        ]
      }
}'

```

## results:

### 200:
```
{
  "success": true,
  "data": {
    "web": [{
      "title": "<string>",
      "description": "<string>",
      "url": "<string>",
      "markdown": "<string>",
      "html": "<string>",
      "rawHtml": "<string>",
      "summary": "<string>",
      "links": [
        "<string>"
      ],
      "screenshot": "<string>",
      "metadata": {
        "title": "<string>",
        "description": "<string>",
        "sourceURL": "<string>",
        "statusCode": 123,
        "error": "<string>"
      }
    }],
    "images": [{
      
    }],
    "news": [{
      
    }],
  },
  "warning": "<string>"
}
```

### 408:
```
{
  "success": false,
  "error": "Request timed out"
}
```
### 500:
```
{
  "success": false,
  "error": "An unexpected error occurred on the server."
}
```

### example: 

```
{
  "url": "https://www.ctvnews.ca/vancouver/video/2025/08/27/dramatic-rescue-from-cruise-ship-off-bc-coast/",
  "title": "Dramatic rescue from cruise ship off B.C. coast - CTV News",
  "description": "JD Sports Opens on Vancouver's Robson Street. 02:08 · August 27, 2025 at 11:04AM EDT. Is Your Prebuilt Home Worth Less Than What You Paid? 05 ...",
  "position": 1,
  "summary": "Search and rescue teams from British Columbia and the United States collaborated to evacuate two passengers from a cruise ship off the west coast of Vancouver Island. The operation highlights the effectiveness of cross-border cooperation in emergency situations.",
  "metadata": {
    "favicon": "https://www.ctvnews.ca/pf/resources/images/ctvnews/favicon.ico?d=166",
    "twitter:image": "https://www.ctvnews.ca/resizer/v2/https%3A%2F%2Fd3g70guqh4mw9g.cloudfront.net%2F08-27-2025%2Ft_e81ea116c6694236b4277801c5f825c4_name_CTVNews_3194673_BC082625_SHIP_RESCUE_3.jpg?smart=true&auth=d6353775615acf26ecd927e91c37c27706c0c04f400bf21434c8699a2141edfa&width=1200&height=630",
    "og:image": "https://www.ctvnews.ca/resizer/v2/https%3A%2F%2Fd3g70guqh4mw9g.cloudfront.net%2F08-27-2025%2Ft_e81ea116c6694236b4277801c5f825c4_name_CTVNews_3194673_BC082625_SHIP_RESCUE_3.jpg?smart=true&auth=d6353775615acf26ecd927e91c37c27706c0c04f400bf21434c8699a2141edfa&width=1200&height=630",
    "twitter:description": "Search and rescue teams from B.C. and the U.S. worked together to evacuate two passengers from a cruise ship off Vancouver Island's west coast.",
    "twitter:site": "@ctvnews",
    "og:title": "Dramatic rescue from cruise ship off B.C. coast",
    "ogTitle": "Dramatic rescue from cruise ship off B.C. coast",
    "ogImage": "https://www.ctvnews.ca/resizer/v2/https%3A%2F%2Fd3g70guqh4mw9g.cloudfront.net%2F08-27-2025%2Ft_e81ea116c6694236b4277801c5f825c4_name_CTVNews_3194673_BC082625_SHIP_RESCUE_3.jpg?smart=true&auth=d6353775615acf26ecd927e91c37c27706c0c04f400bf21434c8699a2141edfa&width=1200&height=630",
    "og:type": "video",
    "ogUrl": "https://www.ctvnews.ca/vancouver/video/2025/08/27/dramatic-rescue-from-cruise-ship-off-bc-coast/",
    "fb:pages": "265325440237679,525693370806473",
    "keywords": "",
    "twitter:card": "summary_large_image",
    "title": "Dramatic rescue from cruise ship off B.C. coast – CTVNews",
    "ogSiteName": "CTV News",
    "ogDescription": "Search and rescue teams from B.C. and the U.S. worked together to evacuate two passengers from a cruise ship off Vancouver Island's west coast.",
    "viewport": "width=device-width, initial-scale=1",
    "og:site_name": [
      "CTV News",
      "CTVNews"
    ],
    "og:url": "https://www.ctvnews.ca/vancouver/video/2025/08/27/dramatic-rescue-from-cruise-ship-off-bc-coast/",
    "twitter:title": "Dramatic rescue from cruise ship off B.C. coast",
    "language": "en",
    "description": "Search and rescue teams from B.C. and the U.S. worked together to evacuate two passengers from a cruise ship off Vancouver Island's west coast.",
    "og:description": "Search and rescue teams from B.C. and the U.S. worked together to evacuate two passengers from a cruise ship off Vancouver Island's west coast.",
    "scrapeId": "fa0f658d-6bac-4378-bf50-9d331659685c",
    "sourceURL": "https://www.ctvnews.ca/vancouver/video/2025/08/27/dramatic-rescue-from-cruise-ship-off-bc-coast/",
    "url": "https://www.ctvnews.ca/vancouver/video/2025/08/27/dramatic-rescue-from-cruise-ship-off-bc-coast/",
    "statusCode": 200,
    "contentType": "text/html; charset=utf-8",
    "proxyUsed": "basic",
    "cacheState": "miss"
  }
}

```

user_2nmd5E52UkUnj780g34rzkNhHcB
