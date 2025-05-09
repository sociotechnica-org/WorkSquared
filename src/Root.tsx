import { makePersistedAdapter } from "@livestore/adapter-web";
import LiveStoreSharedWorker from "@livestore/adapter-web/shared-worker?sharedworker";
import { LiveStoreProvider } from "@livestore/react";
import { FPSMeter } from "@overengineering/fps-meter";
import React from "react";
import { unstable_batchedUpdates as batchUpdates } from "react-dom";

import { MainSection } from "./components/MainSection.js";
import LiveStoreWorker from "./livestore.worker?worker";
import { schema } from "./livestore/schema.js";
import { makeTracer } from "./otel.js";
import { getStoreId } from "./util/store-id.js";

const AppBody: React.FC = () => (
  <section className="chat-app">
    <MainSection />
  </section>
);

const storeId = getStoreId();

const adapter = makePersistedAdapter({
  storage: { type: "opfs" },
  worker: LiveStoreWorker,
  sharedWorker: LiveStoreSharedWorker,
});

const otelTracer = makeTracer("todomvc-sync-cf-main");

export const App: React.FC = () => (
  <LiveStoreProvider
    schema={schema}
    renderLoading={(_) => <div>Loading LiveStore ({_.stage})...</div>}
    adapter={adapter}
    batchUpdates={batchUpdates}
    storeId={storeId}
    otelOptions={{ tracer: otelTracer }}
    syncPayload={{ authToken: "insecure-token-change-me" }}
  >
    <div style={{ top: 0, right: 0, position: "absolute", background: "#333" }}>
      <FPSMeter height={40} />
    </div>
    <AppBody />
  </LiveStoreProvider>
);
