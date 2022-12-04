import React, {Component} from 'react';
class Dropdown extends Component {
    render () {
        return (
            <div class="relative inline-flex" required>
        <select class="border border-gray-300 rounded-full text-gray-600 h-10 pl-5 pr-10 bg-white hover:border-gray-400 focus:outline-none appearance-none">
          <option>New Condition</option>
          <option>Lightly Used (Almost New) Condition</option>
          <option>Moderately Used (Obvious Marks on the Product) Condition</option>
          <option>Heavily Used (Excessive Marks on the Product) Condition</option>
          <option>Broken Condition</option>
        </select>
      </div>
        );
    }
}

export default Dropdown;