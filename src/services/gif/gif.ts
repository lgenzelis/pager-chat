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

const timeoutLimitMs = 10000;

export async function getGifResults(query: string): Promise<GifResults | null> {
  try {
    const timeoutPromise = new Promise<undefined>((resolve) => setTimeout(resolve, timeoutLimitMs));
    const fetchPromise = fetch(`https://api.giphy.com/v1/gifs/search?q=${query || 'rickroll'}&api_key=${API_KEY}`);

    const response = await Promise.race([timeoutPromise, fetchPromise]);

    const responseParsed: GiphyResponse | undefined = await response?.json();

    if (!responseParsed || !responseParsed.data.length) {
      return null;
    } else {
      return responseParsed.data.map(({ id, title, images: { downsized: { url } } }) => ({ id, title, url }));
    }
  } catch (error) {
    return null;
  }
}
