import React, { useState } from 'react';
import { useMutation } from 'your-data-hooks';

export function BotWidget({ collectionId, needle }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchApi = needle.search.bind(needle);
  const chatApi = needle.chatCompletion.bind(needle);

  // Mutation to perform search
  const {
    mutate: runSearch,
    isPending: searching,
    error: searchError,
  } = useMutation(searchApi, {
    onSuccess: ({ results }) => {
      const contexts = results.map((r) => r.text);
      runChat({ collection_id: collectionId, query, contexts });
    },
  });

  // Mutation to perform chat completion
  const {
    mutate: runChat,
    data: chatData,
    isPending: chatting,
    error: chatError,
  } = useMutation(chatApi);

  const loading = searching || chatting;
  const error = searchError || chatError;

  const handleSubmit = (e) => {
    e.preventDefault();
    runSearch({ collection_id: collectionId, text: query });
  };

  return (
    <div className="bg-white font-sans tracking-tight text-black">
      {/* Toggle Button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition duration-150 hover:bg-blue-700"
      >
        {/* Insert your SVG icon here */}
        <svg className="h-8 w-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 ... z" />
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-96 w-96 flex-col items-center rounded-lg border bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask a question..."
              className="w-full border border-gray-300 rounded p-2"
            />
            <button
              type="submit"
              className="mt-2 w-full rounded bg-blue-600 hover:bg-blue-700 text-white p-2"
            >
              Send
            </button>
          </form>

          {loading && <p className="mt-2 text-gray-500">Loading...</p>}
          {error && <p className="mt-2 text-red-500 text-xs">{error.message}</p>}

          {chatData && (
            <div className="mt-4 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-6 shadow-lg">
              <div className="prose max-w-none">
                {chatData.choices?.[0]?.message?.content}
              </div>
              <p className="mt-2 flex items-center text-xs text-gray-400">
                <span>Powered by</span>
                <a
                  href="https://kyoconnectai.com/"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1 font-semibold text-blue-500 hover:underline"
                >
                  KyoConnectAI
                </a>
                <img
                  src="https://kyoconnectai.com/kyoconnectai_logo.jpg"
                  alt="KyoConnectAI Logo"
                  className="inline-block h-4"
                />
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
