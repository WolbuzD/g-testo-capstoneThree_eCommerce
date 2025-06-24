package org.yearup.data;

import org.yearup.models.Profile;

public interface ProfileDao
{
    Profile create(Profile profile);
    Profile getByUserId(int userId);
    void update(int userId, Profile profile);
}
