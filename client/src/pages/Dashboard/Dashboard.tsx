import { useEffect } from 'react';
import TableUi from '../../components/Table/Table';
import { EventSourcePolyfill } from 'event-source-polyfill';
const Dashboard = () => {
  useEffect(() => {
    const eventSourc = new EventSourcePolyfill(
      'http://localhost:8080/api-user/v1/project/c2fb2e4a-8d94-4673-8f81-892784a0eae3/stream-logs',
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
      }
    );
    eventSourc.onmessage = (e) => {
      if (e.data) {
        if (e.data.includes('is live now')) {
          console.log('CLOSING');
          eventSourc.close();
        }
        console.log(e.data);
      }
    };
  }, []);
  return <TableUi />;
};

export default Dashboard;
