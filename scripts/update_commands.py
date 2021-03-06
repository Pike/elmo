#!/usr/bin/env python
# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.

import os
import sys
import subprocess


class InstallPhase(object):
    PIP_INSTALL_VENV = (
        "pip install "
        "-r requirements/env.txt"
    )
    MIGRATE_EXEC = "./manage.py migrate"
    STATICFILES_COLLECT_EXEC = "./manage.py collectstatic --noinput"
    GIT_REVISION = "git rev-parse HEAD > collected/static/revision"
    DJANGOCOMPRESSOR_COMPRESS_EXEC = "./manage.py compress -f"
    REFRESH_FEEDS_EXEC = "./manage.py refresh_feeds"
    def __init__(self, verbose=False):
        self.verbose = verbose
        self.basedir = os.path.abspath(
            os.path.join(os.path.dirname(__file__), '..')
        )
        self.commandlist = [
            [self.PIP_INSTALL_VENV],
            [self.MIGRATE_EXEC],
            [self.STATICFILES_COLLECT_EXEC],
            [self.DJANGOCOMPRESSOR_COMPRESS_EXEC],
            [self.GIT_REVISION],
            [self.REFRESH_FEEDS_EXEC],
        ]

    def execute(self):
        for cmd in self.commandlist:
            if self.verbose:
                sys.stdout.write("%s\n" % ' '.join(cmd))
            subprocess.check_call(cmd, shell=True, cwd=self.basedir)
