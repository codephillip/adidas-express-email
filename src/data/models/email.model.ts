/* eslint import/no-cycle: "off" */
import { Length, IsIn } from 'class-validator';
import { Entity, BaseEntity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { emailEmailTypeChoices } from '../../server/utils/constants/fieldChoices';


@Entity()
export default class Email extends BaseEntity {

  @PrimaryGeneratedColumn('uuid')
  id: string

  @Length(0,255)
  @Column()
  emailAddress: string

  @IsIn(emailEmailTypeChoices)
  @Length(0,255)
  @Column({ default: 'General',  })
  emailType: string

  @Length(0,2000)
  @Column()
  message: string

  @Length(0,255)
  @Column()
  subject: string

  @Column({ default: () => 'CURRENT_TIMESTAMP',  })
  createdAt: Date
}

