import { socketClient } from '../lib/client';
import { debounce } from '../lib/util';

export default function WorkflowNav() {
    const debouncedRequestPreviousGroup = debounce(requestPreviousGroup, 100);
    const debouncedRequestNextGroup = debounce(requestNextGroup, 100);

    function requestPreviousGroup() {
        socketClient.publish({
          destination: '/app/previousgroup',
          body: JSON.stringify({})
        });
      }
    
      function requestNextGroup() {
        socketClient.publish({
          destination: '/app/nextgroup',
          body: JSON.stringify({})
        });
      }
    
      // function requestHasPreviousGroup() {
      //   socketClient.publish({
      //     destination: '/app/haspreviousgroup',
      //     body: JSON.stringify({})
      //   });
      // }
    
      // function requestHasNextGroup() {
      //   socketClient.publish({
      //     destination: '/app/hasnextgroup',
      //     body: JSON.stringify({})
      //   });
      // }

    return (<table style="width:100%">
        <tbody>
            <tr>
                <td>
                    <button 
                    class="font-semibold w-32 rounded-full bg-violet-500 text-white border-none hover:bg-orange-500" 
                    textContent='Previous' 
                    onClick={() => debouncedRequestPreviousGroup()} />
                </td>
                <td>
                    <button 
                    class="font-semibold w-32 rounded-full bg-violet-500 text-white border-none hover:bg-orange-500" 
                    textContent='Next' 
                    onClick={() => debouncedRequestNextGroup()} />
                </td>
            </tr>
        </tbody>
    </table>);

}
