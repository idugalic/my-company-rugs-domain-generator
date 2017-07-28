package com.idugalic.commandside.myaggregate.aggregate;

import org.axonframework.commandhandling.model.AggregateIdentifier;
import org.axonframework.spring.stereotype.Aggregate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * My sample aggregate root.
 * 
 * You should implement your aggregate here !!!
 */
@Aggregate
public class MyAggregate{

    private static final Logger LOG = LoggerFactory.getLogger(MyAggregate.class);

    /**
     * Aggregates that are managed by Axon must have a unique identifier. Strategies
     * similar to GUID are often used. The annotation 'AggregateIdentifier' identifies the
     * id field as such.
     */
    @AggregateIdentifier
    private String id;
    

    /**
     * This default constructor is used by the Repository to construct a prototype
     */
    public MyAggregate() {
    }

    public String getId() {
        return id;
    }

}
