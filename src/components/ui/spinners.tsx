import Spinner from '@/stories/Spinner';

const Spinners = () => {
  return (
    <div className=''>
      <div className='p-4'>
        <h1 className='text-2xl font-bold mb-8'>스피너</h1>
        <div className='grid grid-cols-3 gap-4'>
          <div>
            <Spinner color='primary-50' />
            <p>primary-50</p>
          </div>
          <div>
            <Spinner color='primary-200' />
            <p>primary-200</p>
          </div>
          <div>
            <Spinner color='primary-400' />
            <p>primary-400</p>
          </div>
          <div>
            <Spinner color='primary-600' />
            <p>primary-600</p>
          </div>
          <div>
            <Spinner color='secondary-50' />
            <p>secondary-50</p>
          </div>
          <div>
            <Spinner color='secondary-100' />
            <p>secondary-100</p>
          </div>
          <div>
            <Spinner color='secondary-400' />
            <p>secondary-400</p>
          </div>
          <div>
            <Spinner color='secondary-600' />
            <p>secondary-600</p>
          </div>
          <div>
            <Spinner color='gray-50' />
            <p>gray-50</p>
          </div>
          <div>
            <Spinner color='gray-100' />
            <p>gray-100</p>
          </div>
          <div>
            <Spinner color='gray-200' />
            <p>gray-200</p>
          </div>
          <div>
            <Spinner color='gray-300' />
            <p>gray-300</p>
          </div>
          <div>
            <Spinner color='gray-400' />
            <p>gray-400</p>
          </div>
          <div>
            <Spinner color='gray-500' />
            <p>gray-500</p>
          </div>
          <div>
            <Spinner color='gray-600' />
            <p>gray-600</p>
          </div>
          <div>
            <Spinner color='gray-700' />
            <p>gray-700</p>
          </div>
          <div>
            <Spinner color='gray-800' />
            <p>gray-800</p>
          </div>
          <div>
            <Spinner color='gray-900' />
            <p>gray-900</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Spinners;
