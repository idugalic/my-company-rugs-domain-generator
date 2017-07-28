package com.idugalic.commandside.myaggregate.aggregate;

import org.axonframework.messaging.interceptors.BeanValidationInterceptor;
import org.axonframework.test.aggregate.AggregateTestFixture;
import org.axonframework.test.aggregate.FixtureConfiguration;
import org.junit.Before;

import com.idugalic.common.model.AuditEntry;

/**
 * Domain (aggregate) test.
 */
public class MyAggregateTest {

    private FixtureConfiguration<MyAggregate> fixture;
    private AuditEntry auditEntry;
    private static final String WHO = "john";

    @Before
    public void setUp() throws Exception {
        fixture = new AggregateTestFixture<MyAggregate> (MyAggregate.class);
        fixture.registerCommandDispatchInterceptor(new BeanValidationInterceptor());
        auditEntry = new AuditEntry(WHO);
    }


}
