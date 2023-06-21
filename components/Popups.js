import React, { useState } from 'react'

export function TransactionPopup({ message, hidePopup, isVisible }) {
  return (
    <div>
      {isVisible && (
        <>
          <div
            className="p-2 bg-[#E5BA73] items-center text-white leading-none lg:rounded-full flex lg:inline-flex rounded-full"
            role="alert"
          >
            <span className="flex rounded-full bg-[#C58940] uppercase px-2 py-1 text-xs font-bold mr-3">
              New
            </span>
            <a
              target="_blank"
              rel="noreferrer"
              href={`https://goerli.etherscan.io/tx/${message}`}
              className="font-semibold cursor-pointer hover:underline text-gray-700 mr-2 text-left flex-auto"
            >
              Check your Coffee Transaction
            </a>
            <svg
              onClick={hidePopup}
              className="fill-current h-6 w-6 text-[#6F4E37]"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </div>
        </>
      )}
    </div>
  )
}

export function ErrorPopup({ message, hidePopup, error }) {
  return (
    <div>
      {error && (
        <>
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <span className="block pr-8 sm:inline">{message}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3">
              <svg
                onClick={hidePopup}
                className="fill-current h-6 w-6 text-red-500"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
          </div>
        </>
      )}
    </div>
  )
}
