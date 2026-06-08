import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtoLayout from './components/ProtoLayout';
import ListPage from './pages/ListPage';
import NewPage from './pages/NewPage';
import EditPage from './pages/EditPage';
import ChannelAttributionPage from './pages/ChannelAttributionPage';
import NewChannelPage from './pages/NewChannelPage';
import EditChannelPage from './pages/EditChannelPage';

export default function App() {
  return (
    <BrowserRouter basename="/standalone-apps/advanced-costs">
      <ProtoLayout>
        <Routes>
          <Route path="/" element={<ListPage />} />
          <Route path="/new" element={<NewPage />} />
          <Route path="/edit/:id" element={<EditPage />} />
          <Route path="/channel-attribution" element={<ChannelAttributionPage />} />
          <Route path="/channel-attribution/new" element={<NewChannelPage />} />
          <Route path="/channel-attribution/edit/:id" element={<EditChannelPage />} />
        </Routes>
      </ProtoLayout>
    </BrowserRouter>
  );
}
