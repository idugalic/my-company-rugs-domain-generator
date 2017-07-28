package com.idugalic.commandside.myaggregate.command;

import com.idugalic.common.blog.model.BlogPostCategory;
import com.idugalic.common.command.AuditableAbstractCommand;
import com.idugalic.common.model.AuditEntry;

import java.util.Date;
import java.util.UUID;

import javax.validation.constraints.Future;
import javax.validation.constraints.NotNull;

import org.axonframework.commandhandling.TargetAggregateIdentifier;
import org.hibernate.validator.constraints.NotBlank;

/**
 * A sample command for creating an aggregate.
 */
public class CreateMyAggregateCommand extends AuditableAbstractCommand {

    @TargetAggregateIdentifier
    private String id;

    public String getId() {
        return id;
    }
}
