import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const ChannelList = ({ channels, onChannelClick, selectedChannel, onRemoveChannel }) => {
  const { t } = useTranslation();
  if (channels.length === 0) {
    return (
      <div className="text-center py-4 text-gray-500 text-sm">
        {t('channelList.noChannels')}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <button
        onClick={() => onChannelClick(null)}
        className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
          selectedChannel === null
            ? 'bg-blue-100 text-blue-700 font-semibold'
            : 'hover:bg-gray-100 text-gray-700'
        }`}
      >
        <span className="flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
          </svg>
          {t('channelList.allChannels')}
        </span>
      </button>

      {channels.map((channel) => (
        <div
          key={channel.id}
          className={`group relative px-3 py-2 rounded-lg transition-colors ${
            selectedChannel === channel.channel_id
              ? 'bg-blue-100 text-blue-700'
              : 'hover:bg-gray-100'
          }`}
        >
          <button
            onClick={() => onChannelClick(channel.channel_id)}
            className="w-full text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium truncate pr-6">
                {channel.channel_title}
              </span>
            </div>
          </button>
          <button
            onClick={() => onRemoveChannel(channel.channel_id)}
            className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-red-100 rounded"
            aria-label={`${channel.channel_title} ${t('channelList.removeChannelAria')}`}
            title={t('common.removeChannel')}
          >
            <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
};

ChannelList.propTypes = {
  channels: PropTypes.array.isRequired,
  onChannelClick: PropTypes.func.isRequired,
  selectedChannel: PropTypes.string,
  onRemoveChannel: PropTypes.func.isRequired,
};

export default ChannelList;
