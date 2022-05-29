import React, { Suspense } from "react";
import Parser from "html-react-parser";
import { Provider, atom, useAtom } from "jotai";
import { useAtomValue, useUpdateAtom } from "jotai/utils";
import { atomWithQuery } from "jotai/query";
import { a, useSpring } from "@react-spring/web";

const postId = atom(9001);
const postData = atomWithQuery((get) => ({
  queryKey: ["post", get(postId)],
  queryFn: async ({ queryKey: [, id] }) => {
    await new Promise((r) => setTimeout(r, 1000)); // just a fake loading, it can be deleted
    const response = await fetch(
      `https://hacker-news.firebaseio.com/v0/item/${id}.json`
    );
    return response.json();
  }
}));

function Id() {
  const id = useAtomValue(postId);
  const props = useSpring({ from: { id: 0 }, id, reset: true });
  return <a.h1>{props.id.to(Math.round)}</a.h1>;
}

function Next() {
  const set = useUpdateAtom(postId);
  return (
    <button className="button"  onClick={() => set((x) => x + 1)}>
      READ NEXT
    </button>
  );
}

function Back() {
  const set = useUpdateAtom(postId);
  return (
    <button className="button not"  onClick={() => set((x) => x - 1)}>
      Back
    </button>
  );
}

function PostTitle() {
  const [{ by, title, text, time, kids }] = useAtom(postData);

  return (
    <>
      <div className="container">
        <div className="card">
          <img src="https://images.unsplash.com/photo-1536323760109-ca8c07450053" alt={title} />
          <div className="card__details">
            <div className="tags">
              {
                kids && kids.map((id) => (
                  <span className="tag" key={id}>{ id }</span>
                ))
              }
            </div>

            <span className="date">{new Date(time * 1000).toLocaleDateString("en-US")}</span>

            <div className="more_details">
              <div className="main">
                <div className="name">By: {by}</div>

                {text && <div className="text">{Parser(text)}</div>}
                {/* <a href={url} className="button" >Read More</a> */}
                {/* <a className="button" href={url}>{url}</a> */}
                <div style={{ display: "flex", justifyContent: "space-between", margin: "4px 0" }}>
                  <Back />
                  <Next />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default function App() {
  return (
    <Provider>
      <div className="main_body">
        <Suspense fallback={<div className="lds-ripple"><div></div><div></div></div>}>
          <PostTitle />
        </Suspense>
      </div>
    </Provider>
  );
}



// import React from 'react'
// import { useAtom, atom } from 'jotai'
// import { atomWithQuery } from 'jotai/query'

// const idAtom = atom(1)
// const userAtom = atomWithQuery((get) => ({
//   queryKey: ['users', get(idAtom)],
//   queryFn: async ({ queryKey: [, id] }) => {
//     const res = await fetch(`https://jsonplaceholder.typicode.com/users/${id}`)
//     return res.json()
//   },
// }))

// const App = () => {
//   // return (
//   //   <div className='test' dir='rtl'>
//   //     <div>އައްސަލާމް</div>
//   //     <div>އަލައިކުމް</div>
//   //   </div>
//   // )
// }

// export default App
