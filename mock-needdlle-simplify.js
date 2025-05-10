import React, { useState } from 'react';
import { useMutation } from 'your-data-hooks';

export function BotWidget({ collectionId, needle }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searchApi = needle.search.bind(needle);
  const chatApi   = needle.chatCompletion.bind(needle);

  const { mutate: runChat, data: chatData, isPending: chatting, error: chatError } =
    useMutation(chatApi);

  const { mutate: runSearch, isPending: searching, error: searchError } =
    useMutation(searchApi, {
      onSuccess: (searchResults) => {
        // After getting search results, trigger chat completion
        runChat({ collection_id: collectionId, text: query, search_results: searchResults });
      },
    });

  const loading = searching || chatting;
  const error   = searchError || chatError;

  const handleSubmit = (e) => {
    e.preventDefault();
    setOpen(true);
    runSearch({ collection_id: collectionId, text: query });
  };

  return (
    <div className="bg-white font-sans tracking-tight text-black">
      {/* Floating toggle button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="fixed bottom-5 right-5 flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition duration-150 hover:bg-blue-700"
        aria-label={open ? 'Close chat widget' : 'Open chat widget'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          {open ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.862 9.862 0 01-4.255-.867L3 21l1.867-4.745A9.862 9.862 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>
      </button>

      {open && (
        <div className="fixed bottom-20 right-5 z-50 flex h-96 w-96 flex-col items-center rounded-lg border bg-white p-4 shadow-lg">
          <form onSubmit={handleSubmit} className="w-full">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full rounded border border-gray-300 p-2 text-sm"
            />
            <button
              type="submit"
              className="mt-2 w-full rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Send
            </button>
          </form>

          {loading && <p className="mt-4 text-sm">Loading…</p>}
          {error && <p className="mt-2 text-red-500 text-xs">{error.message}</p>}
          {chatData && (
            <div className="mt-4 w-full overflow-y-auto rounded-lg border border-gray-300 bg-white p-4 text-sm shadow-inner">
              {chatData.response || JSON.stringify(chatData)}
            </div>
          )}
        </div>
      )}
    </div>
);
}
