import { ObjectType } from '@nestjs/graphql';

import { ResultsResponse } from '../../../../common/dto';
import { User } from '../../user.entity';

@ObjectType()
export class UsersResponse extends ResultsResponse(User) {}
