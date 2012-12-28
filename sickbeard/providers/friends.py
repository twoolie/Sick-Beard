# Author: Nic Wolfe <nic@wolfeden.ca>
# URL: http://code.google.com/p/sickbeard/
#
# This file is part of Sick Beard.
#
# Sick Beard is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# Sick Beard is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with Sick Beard.  If not, see <http://www.gnu.org/licenses/>.

from xml.dom.minidom import parseString

import sickbeard
import generic

from sickbeard import helpers
from sickbeard import logger
from sickbeard import tvcache

class FriendsProvider(generic.GenericProvider):

    def __init__(self, name, url, key):

        generic.GenericProvider.__init__(self, "Friends Link")

        self.supportsBacklog = False

        #self.cache = TvTorrentsCache(self)
        self.name = name
        self.url = url
        self.key = key

    def isEnabled(self):
        return sickbeard.USE_FRIENDS and self.enabled

    def imageName(self):
        return 'friends.png'

    def configStr(self):
        return self.name + '|' + self.url + '|' + self.key + '|' + str(int(self.enabled))

