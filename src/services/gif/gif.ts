const API_KEY = 'p6sA33BUc919642eiVspoiJu9PHTxcSd';

type GiphyResponseLine = {
  id: string;
  title: string;
  images: {
    downsized: {
      url: string;
    };
  };
};

type GiphyResponse = {
  data: GiphyResponseLine[];
};

export type GifResults = { id: string; title: string; url: string }[];

export async function getGifResults(query: string): Promise<GifResults | null> {
  const response = await fetch(`http://api.giphy.com/v1/gifs/search?q=${query || 'rickroll'}&api_key=${API_KEY}`);
  const responseParsed: GiphyResponse = await response.json();

  if (!responseParsed) {
    return null;
  } else {
    return responseParsed.data.map(({ id, title, images: { downsized: { url } } }) => ({ id, title, url }));
  }
}
