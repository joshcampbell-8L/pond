/**
 *  Copyright (c) 2016, The Regents of the University of California,
 *  through Lawrence Berkeley National Laboratory (subject to receipt
 *  of any required approvals from the U.S. Dept. of Energy).
 *  All rights reserved.
 *
 *  This source code is licensed under the BSD-style license found in the
 *  LICENSE file in the root directory of this source tree.
 */

import Collector from "./collector";
import PipelineOut from "./pipeline-out";

class CollectionOut extends PipelineOut {

    constructor(pipeline, options, callback) {
        super(pipeline);
        
        this._callback = callback;
        this._collector = new Collector({
            windowType: pipeline.getWindowType(),
            windowDuration: pipeline.getWindowDuration(),
            groupBy: pipeline.getGroupBy(),
            emitOn: pipeline.getEmitOn()
        }, (collection, windowKey, groupByKey) => {
            if (this._callback) {
                this._callback(collection, windowKey, groupByKey);
            } else {
                this._pipeline.addResult(`${windowKey}-${groupByKey}`, collection);
            }
        });
    }

    addEvent(event) {
        this._collector.addEvent(event);
    }

    onEmit(cb) {
        this._callback = cb;
    }
    
    flush() {
        this._collector.flushCollections();
        if (!this._callback) {
            this._pipeline.resultsDone();
        }
    }
}

export default CollectionOut;
